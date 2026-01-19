from typing import Optional
import uuid
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from fastapi.responses import Response
from fastapi import status
from fastapi.concurrency import run_in_threadpool
from api.endpoints.users import require_auth
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal
from pydantic import BaseModel
from database import supabase
import markdown2
import pdf_generator
import crud
import models


router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


class PdfRequest(BaseModel):
    markdown_content: str
    title: str


@router.post("/generate-pdf", response_class=Response)
async def generate_pdf_from_markdown(request_data: PdfRequest):
    html_from_markdown = markdown2.markdown(
        request_data.markdown_content,
        extras=[
            "fenced-code-blocks",
            "tables",
            "spoiler",
            "cuddled-lists",
            "footnotes",
            "strike",
            "underline",
            "task_list",
            "header-ids",
            "escape",
        ],
    )

    with open("pdf_template.html", "r") as f:
        html_template = f.read()

    full_html = html_template.replace("{content}", html_from_markdown)
    pdf_bytes = await pdf_generator.create_pdf_from_html(
        html_content=full_html, title=request_data.title
    )

    headers = {
        "Content-Disposition": f'attachment; filename="{request_data.title}.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)


@router.post("/upload-image", dependencies=[Depends(require_auth)])
async def upload_image(
    file: UploadFile = File(...),
    chapter_id: Optional[int] = Form(None),
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    try:
        file_content = await file.read()

        file_ext = file.filename.split(".")[-1] if "." in file.filename else ""
        file_name = f"{uuid.uuid4()}.{file_ext}" if file_ext else str(uuid.uuid4())
        file_path = f"public/{file_name}"

        await run_in_threadpool(
            supabase.storage.from_("cognis-images").upload,
            path=file_path,
            file=file_content,
            file_options={"cache-control": "31536000", "upsert": "false"},
        )

        public_url = supabase.storage.from_("cognis-images").get_public_url(file_path)

        await crud.create_uploaded_image(
            db=db,
            user_id=current_user.id,
            public_url=public_url,
            storage_path=file_path,
            chapter_id=chapter_id,
        )

        return {"imageUrl": public_url}

    except Exception as e:
        print(f"Supabase upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.post(
    "/track-visit/subject/{subject_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def track_subject_visit(subject_id: int, db: AsyncSession = Depends(get_db)):
    """
    Tracks a visit to a subject. This is a public endpoint.
    """
    await crud.increment_subject_visit_count(db, subject_id=subject_id)
    return


@router.post("/upload-pdf", dependencies=[Depends(require_auth)])
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a PDF to the 'pdfs' folder in the Supabase storage bucket.
    Returns the public URL of the uploaded file.
    """
    # We can add a check for the file type for extra security
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only PDFs are allowed."
        )

    try:
        file_content = await file.read()

        # Generate a unique filename
        import uuid

        file_name = f"{uuid.uuid4()}.pdf"

        # --- SAVE TO A DEDICATED 'pdfs' FOLDER ---
        storage_path = f"pdfs/{file_name}"

        # Run the synchronous Supabase call in a threadpool
        def upload_sync():
            supabase.storage.from_("cognis-images").upload(
                path=storage_path,
                file=file_content,
                file_options={
                    "cache-control": "31536000",
                    "upsert": "false",
                    "content-type": "application/pdf",
                },
            )

        await run_in_threadpool(upload_sync)

        public_url = supabase.storage.from_("cognis-images").get_public_url(
            storage_path
        )

        return {"fileUrl": public_url}  # Return a more generic 'fileUrl'

    except Exception as e:
        print(f"Supabase PDF upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from pydantic import BaseModel
import markdown2
import pdf_generator

router = APIRouter()


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

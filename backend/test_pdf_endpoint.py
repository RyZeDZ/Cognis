import httpx
import asyncio


async def test_generate_pdf():
    print("Reading markdown content from test_notes.md...")
    try:
        with open("test_notes.md", "r", encoding="utf-8") as f:
            markdown_content = f.read()
    except FileNotFoundError:
        print("Error: test_notes.md not found. Make sure it's in the same directory.")
        return

    payload = {
        "markdown_content": markdown_content,
        "title": "Set Theory Test Document",
    }

    api_url = "http://192.168.1.44:8000/api/utils/generate-pdf"

    print(f"Sending request to {api_url}...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(api_url, json=payload)

            if response.status_code == 200:
                with open("test_output.pdf", "wb") as f:
                    f.write(response.content)
                print("\nSuccess! PDF saved as test_output.pdf")
            else:
                print(f"\nError: API returned status code {response.status_code}")
                print("Response body:", response.text)

        except httpx.ConnectError as e:
            print(f"\nConnection Error: Could not connect to the server at {api_url}.")
            print("Please make sure your FastAPI server is running.")
        except Exception as e:
            print(f"\nAn unexpected error occurred: {e}")


if __name__ == "__main__":
    asyncio.run(test_generate_pdf())

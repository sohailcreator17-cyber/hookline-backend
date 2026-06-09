import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)

SYSTEM_PROMPT = """
Aap dunya ke sabsay behtareen B2B sales expert hain.
Aap ko jo bhi text diya jaye, aap ne us company ki kamiyan dhoondni hain aur ek short, punchy cold email/pitch likhni hai.

Rules:
- Personalized ho
- Professional ho
- Strong hook ho
- Clear CTA ho
- 150 words se kam ho
"""

def handler(request):
    try:
        if request.method != "POST":
            return {
                "statusCode": 405,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "error": "Method not allowed"
                })
            }

        body = request.get_json()

        user_input = body.get("input")

        if not user_input:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "error": "Input field is required"
                })
            }

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ],
            temperature=0.7,
            max_tokens=300
        )

        pitch = completion.choices[0].message.content

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "pitch": pitch
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }
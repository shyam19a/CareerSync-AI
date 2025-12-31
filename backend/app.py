import gradio as gr
from main import app  # your existing FastAPI app

gradio_app = gr.Interface(
    fn=lambda: "CareerSync AI backend running",
    inputs=None,
    outputs="text",
)

app = gr.mount_gradio_app(app, gradio_app, path="/")

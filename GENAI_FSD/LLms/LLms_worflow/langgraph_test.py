import os
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

api_key = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")


# Shared state
class AgentState(TypedDict):
    question: str
    answer: str
    audit_passed: bool
    iterations: int


# Researcher node
def researcher(state: AgentState):

    print("\n--- Researcher thinking ---")

    prompt = f"""
    Answer this finance question carefully:

    {state['question']}

    Provide a numerical answer.
    """

    response = llm.invoke(prompt)

    return {
        "answer": response.content,
        "iterations": state.get("iterations", 0) + 1
    }


# Auditor node
def auditor(state: AgentState):

    print("\n--- Auditor verifying ---")

    prompt = f"""
    Question: {state['question']}

    Proposed answer: {state['answer']}

    Verify if this answer seems correct.

    Reply ONLY with:
    PASS
    or
    FAIL
    """

    response = llm.invoke(prompt)

    decision = "PASS" in response.content.upper()

    return {"audit_passed": decision}


# Build graph
workflow = StateGraph(AgentState)

workflow.add_node("research", researcher)
workflow.add_node("audit", auditor)

workflow.set_entry_point("research")

workflow.add_edge("research", "audit")

workflow.add_conditional_edges(
    "audit",
    lambda state: END if state["audit_passed"] else "research"
)

app = workflow.compile()


# Run workflow
result = app.invoke({
    "question": "What is the difference between $5B and $4.8B?",
    "answer": "",
    "audit_passed": False,
    "iterations": 0
})

print("\nFinal Answer:\n", result["answer"])
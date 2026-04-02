import { CriteriaDetail } from '../model/CriteriaDetail';

export function extractSnippetsPromptFactory(criteria: CriteriaDetail[]) {
  return `
You are a **meticulous, insightful, and critical analyst**. Your goal is to **inspect and analyze AI assistant responses** to a user instruction, according to a set of **evaluation criteria**. You can analyze text to identify **high-level intentions and patterns**. You should carefully analyze every detail. You will receive:

1. **User instructions** (the prompt or query given to the AI assistant).
2. **AI assistant's response** to those instructions.
3. A list of **evaluation criteria**. Each criterion includes the examples that should be *excluded* (= out of scope of this criterion).

---

## Instructions

You should analyze the AI assistant's response on each of the criteria provided. Follow the steps provided below for each criterion. Focus on only one criterion at a time. Do not consider other criteria or think about other possible criteria.

### 1. Identify Relevant Snippets

- Identify snippets from the AI assistant's response that are relevant to the criterion.
- These snippet should represent **key points** that can positively or negatively impact the response's quality on the criterion.
- You should not contain snippets that is similar to 'Examples to Exclude' of each criterion. If the snippet should be excluded, you MUST mark the snippet as 'isExcluded' in response.
- Each snippet can be a phrase, sentence, a couple of sentences, or a paragraph.
- If the entire response is relevant, use the token \`"$WHOLE$"\`.

### 2. Summary of the Snippet's Context

- For every snippet, you should provide a clear and concise summary of the context in which the snippet appears. This summary should help the reader understand the purpose and relevance of the snippet without requiring them to review the entire surrounding content.
- Focus on answering the following questions:
    - Where does the snippet come from? Identify where the snippet is located in the whole response.
    - What is the main topic or theme? Describe what the snippet is about, highlight its key subject matter.
    - Why is this snippet important? Explain its relevance in the larger context.
    - Are there any key details to note? Mention any crucial background information that helps clarify the snipept's meaning, but that is not included in the snippet itself.
- Provide your summary in a concise and clear manner, within one sentence.

---

## Criteria

${criteria
  .map(
    (c) => `### ${c.name}
    
**Description**: ${c.description}

${`**Examples to Exclude** (<Feature: Snippet>)\n` + (c.excludeBehaviors.length === 0 ? '* Not provided *' : c.excludeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}\n
  `,
  )
  .join('\n')}

---

## Output Format

Provide your analysis in the following YAML format. Ensure that you include the code block markers (\`\`\`). Ensure that you correctly and faithfully follow the format below by ensuring that you have the correct indentation and formatting.

\`\`\`yaml
result:
  - criterion_name: <name of the criterion>
    evidence_snippets:
      - id: 1
        snippet: |
          <verbatim content of the snippet from the response>
        context: |
          <one-sentence summary of the context surrounding the snippet>
        isExcluded: |
          <"false" or "true", whether this snippet should be excluded according to the 'Examples to Exclude' of the criterion>
      - id: 2
        snippet: |
          <verbatim content of the snippet from the response>
        context: |
          <one-sentence summary of the context surrounding the snippet>
        isExcluded: |
          <"false" or "true", whether this snippet should be excluded according to the 'Examples to Exclude' of the criterion>
      - <repeat for the remaining snippets>

result:
  - criterion_name: <name of the criterion>
    evidence_snippets:
      - id: 1
        snippet: |
          <verbatim content of the snippet from the response>
        context: |
          <one-sentence summary of the context surrounding the snippet>
        isExcluded: |
          <"false" or "true", whether this snippet should be excluded according to the 'Examples to Exclude' of the criterion>
      - <repeat for the remaining snippets>

  - <repeat for the remaining criteria
\`\`\`
`;
}

export function evaluateSnippetsPromptFactory(criterion: CriteriaDetail) {
  return `system_prompt: |-
You are a **meticulous, insightful, and critical evaluator**. Your goal is to **analyze and assess the quality of snippets from AI assistant responses**.
Specifically, you will be provided with an **evaluation criterion**. Each criterion includes the examples that should be evaluated as *positive*, and *negative*.
You will then be provided with a list of snippets that were taken from multiple AI assistant responses to different user requests. Each snippet is relevant to the evaluation criterion. Your task is to analyze each snippet to identify **high-level intentions or patterns** and then evaluate how each snippet aligns with the criterion. You uphold the **highest standards** and analyze every detail. For each snippet, you will receive:

1. **ID**: A unique ID used to identify the snippet.
2. **Snippet**: The actual snippet or fragment of text from the AI assistant's response that is relevant to the criterion.
3. **Context**: A short summary of the snippet's role or function within the overall response and the surrounding context that existed around the snippet in the response.

---

## Instructions

You should evaluate each of the snippets from the AI assistant's responses on the criterion provided. Follow the steps provided below for each of the snippets. Remember to evaluate **all of the snippets**.

### 1. Reason and Evaluate the Snippet

- For every snippet, you should analyze how the snippet relates to the criterion.
- You should focus on what **semantic, functional, or structural role** the snippet serves from the lens of the criterion.
- Based on this, you should reason about how the snippet aligns or misaligns from the standards set by the criterion.
- Describe your reasoning and analysis for each snippet in detail.

### 2. Generalizing Snippet into Abstract Features

- Based on your analysis and reasoning for each snippet, you should represent each snippet as an **abstract feature** in relation to the given evaluation criterion.
- An **abstract feature** is a high-level abstraction or generalized representation of the snippet's semantic, functional, or structural role in relation to the criterion.
- **Why use features?**
    - By representing each snippet as a feature, we can compare snippets between different AI assistant responses even when the task, context, or details of these responses differs.
    - Features allows us to understand the high-level patterns of how the AI assistant composes its responses when considering the criterion's standards, rather than the specific content of the response.
- **How to abstract a snippet into a feature:**
    - You should first reason about the semntict, functional, or structural role that the snippet serves in the context of the criterion.
    - Then, you should provide a concise label that can describe that function in abstract terms.
    - Your goal is to focus on the abstract role of the snippet rather than its content, context, details, or wording.
- **Examples of snippets and their conceptual features:**
    - Example 1
    - User's Instruction: "Explain this scientific article to a 5-year-old."
    - Criterion: "Engagingness: Is the explanation provided in a way that is engaging and interesting for young children?"
    - Snippet: "antibodies are like mini-soliders that shoot down germs in your body to keep you healthy"
    - Feature: "Explaining scientific concepts through metaphorical storytelling"
    - Example 2
    - User's Instruction: "Explain this scientific article to a 5-year-old."
    - Criterion: "Safety: Does the explanation avoid any references to plausibly harmful, violent, or inappropriate details?"
    - Snippet: "Antibodies are like mini-soliders that shoot down germs in your body to keep you healthy."
    - Feature: "References to mildly violent or harmful actions"
    - Example 3
    - User's Instruction: "Can you analyze this resume, decide whether the candidate is suitable for a job as a front-end developer in our company, and write an email to the candidate that informs them of our decision?"
    - Criterion: "Directness: Does the email clearly communicate the decision and the reasons behind it to the candidate?"
    - Snippet: "While your skills with ReactJS, Vue, and Skelte are impressive, we are unsure whether you may be a good fit for our company's architecture."
    - Feature: "Hedged communication with ambiguous decision outcome"
    - Example 4
    - User's Instruction: "Create a weekly workout plan that focuses on building leg and shoulder muscles."
    - Criterion: "Accessibility: Is the plan described in a way that can be easy to understand and follow for people with diverse levels of fitness knowledge and experience?"
    - Snippet: "Start with a 5-day split: Monday—deadlifts (5x5 at 80% of 1RM), Wednesday—squats (4x6 at 75% of 1RM), Friday—bench press (5x5 at 80% of 1RM). Track progress weekly using linear periodization."
    - Feature: "Specialized instruction with technical and unexplained jargon"
    - Note: Notice how all of the exampels focus on the role of the snippet in relation to the criterion, rather than on the actual content of the snippet.

### 3. Evaluate the Feature

Based on your analysis of the snippet and feature, decide on whether the feature is **positive** (i.e., helps fulfill the criterion) or **negative** (i.e., hinders the fulfillment of the criterion). You should decide on either "positive" or "negative". Avoid providing "neutral" ratings.
You should consider the 'Positive Examples' and 'Negative Examples' when you judge the snippet is positive or negative. These examples are provided by the user, so you should consider them IMPORTANTLY.

---

## Criterion

### ${criterion.name}

**Description**: ${criterion.description}

${`**Positive Examples** (<Feature: Snippet>)\n` + (criterion.positiveBehaviors.length === 0 ? '* Not provided *' : criterion.positiveBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

${`**Negative Examples** (<Feature: Snippet>)\n` + (criterion.negativeBehaviors.length === 0 ? '* Not provided *' : criterion.negativeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

---

## Output Format

Provide your evaluations in the following YAML format. Ensure that you include the code block markers (\`\`\`). Ensure that you correctly and faithfully follow the format below by ensuring that you have the correct indentation and formatting. 

\`\`\`yaml
evaluations:
  - id: <original id of the snippet as provided to you>
    evaluation: |
      <analyse, reason, and evaluate the snippet's role and alignment with criterion>
    feature: |
      <abstract feature label>
    impact: "<positive_or_negative>"
  - id: <original id of the snippet as provided to you>
    evaluation: |
      <analyse, reason, and evaluate the snippet's role and alignment with criterion>
    feature: |
      <abstract feature label>
    impact: "<positive_or_negative>"
  - <repeat for all of the remaining snippets>
\`\`\`
`;
}

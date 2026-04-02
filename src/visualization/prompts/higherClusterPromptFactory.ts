export function higherClusterTopicExtractionPromptFactory() {
  return `You are tasked with creating higher level cluster names based on a given list of clusters and their descriptions.
  Your goal is to come up with broader categories that could encompass the concepts from lower level clusters.
  
  ## Context
  The user will provide you with a list of clusters that encapsulate a group of related statement or information. You should analyze the themes and patterns in the clusters to create higher level cluster names that can group and represent the lower level clusters.
  
  ## Instruction
  Your task is to create higher level cluster name that could potentially include all of the provided clusters.
  If there are many clusters with a specific theme, ensure that the higher level cluster name retains sufficient specificity to illustrate the theme.
  You should output one specific cluster name that can fully represent the provided clusters.
  
  1. Analyze the themes, topics, or characteristics common to multiple provided clusters.
  2. Create a name that is specific enough to be meaningful, but not so specific that it cannot meaningfully represent many different clusters.
  3. Ensure that the higher level cluster names are distinct from one another.
  4. Use clear, concise, and descriptive language for the cluster name.
  5. Use the same language as the original clusters for the new cluster names and descriptions.
  6. Provide concise description for each cluster in one sentence.
  
  ## Response Format (in JSON)
  \`\`\`json
  {
    "description": <concise description for the higher level cluster>,
    "name": <clear and concise name for higher level cluster idea>
  }
  \`\`\`
`;
}

export function higherClusterDeduplicatePromptFactory() {
  return `You are tasked with deduplicating a list of cluster names and descriptions into a smaller set of distinct clusters.
Your goal is to create relatively distinct clusters that can best represent the original list.

## Context
The user will provide a list of clusters including their names and descriptions.
This cluster list will be used to categorize diverse data points.
You should ensure that to deduplicate the list to only retain distinctive clusters that do not overlap with eahc other.

## Instruction
  1. Anaylze the given list of cluster names to identify similarites, patterns, and themes.
  2. Group similar cluster names together based on their semantic meaning, not just lexical similarity.
  3. For each group, select a representative name that best captures the essense of the cluster. This can be one of the original clusters' name or a new name that summarizes the group effectively.
  4. Merge the most similar groups until you reach the desired number of clusters. Maintain as much specificity as possbile while merging.
  5. You should write a representative description for the new cluster. Maintain the specificity of original clusters' description.
  5. Ensure that the final set of cluster names are distinct from each other and collectively represent the diversity of original list.
  6. Avoid significantly reducing the original list. The user will provide a target length for the new list.
  7. You do not have to modify or re-create all of the cluster. You should **modify them only when you feel it is necessary**. If not, you can just leave the cluster as is.
  8. Ensure that you use the same language as the original clusters for the new cluster names and descriptions.

## Response Format (in JSON)
\`\`\`json
{
  "justificaiton": <your detailed explanation about the final answer according to instruction>,
  "finals": [
    {
      "name": <new cluster name>,
      "description": <new cluster description>
    },
    ... <new clusters> ...
  ]
}
\`\`\`
`;
}

export function higherClusterReassignPromptFactory() {
  return `You are tasked with categorizing a specific cluster into one of the provided higher-level clusters based on their relevance and similarity.
Your goal is to determine which higher-level cluster best fits the given specific cluster based on its name and description.

## Context
The user will provide the name and description of one lower level cluster and a list of higher level clusters.
You should categorize the lower level cluster into the most relevant higher level cluster.

## Instruction
1. Analyze the name of description of the lower level cluster.
2. Consider the key characteristics, themes, or subject matter of the lower level cluster.
3. Compare these elements to the higher level clusters provided.
4. Determine which higher level cluster best encomopasses the lower level cluster. You MUST assign the lower cluster to the most  suitable higher level cluster, even if multiple higher level clusters are relevant.
5. Make sure you pick the most sensible cluster based on the information provided.

## Response Format (in JSON)
\`\`\`json
{
  "justification": <Justify why you assign the lower level cluster to the answer higher level cluster>,
  "cluster": <the index number of higher level cluster>
}
\`\`\`
`;
}

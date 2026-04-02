export interface CriteriaDetail {
  id: string;
  name: string;
  description: string;
  positiveBehaviors: StoredBehaviorDetail[];
  negativeBehaviors: StoredBehaviorDetail[];
  excludeBehaviors: StoredBehaviorDetail[];
}

export interface StoredBehaviorDetail {
  id: string | null; // if null, it's old one
  feature: string;
  rawSnippet: string;
}

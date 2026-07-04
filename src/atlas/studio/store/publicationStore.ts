import type { PublicationDraft, ReviewStatus } from "@/atlas/publishing/types";

type PublicationStoreState = {
  drafts: PublicationDraft[];
  isGenerating: boolean;
  lastError?: string;
};

type Listener = () => void;

function createPublicationStore() {
  let state: PublicationStoreState = {
    drafts: [],
    isGenerating: false,
  };

  const listeners = new Set<Listener>();

  function emit() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getState(): PublicationStoreState {
      return state;
    },

    setGenerating(isGenerating: boolean, error?: string) {
      state = { ...state, isGenerating, lastError: error };
      emit();
    },

    addDraft(draft: PublicationDraft) {
      state = { ...state, drafts: [draft, ...state.drafts] };
      emit();
    },

    addDrafts(drafts: PublicationDraft[]) {
      state = { ...state, drafts: [...drafts, ...state.drafts] };
      emit();
    },

    getDraft(id: string) {
      return state.drafts.find((draft) => draft.id === id);
    },

    setReviewStatus(id: string, reviewStatus: ReviewStatus, editorNotes?: string) {
      state = {
        ...state,
        drafts: state.drafts.map((draft) =>
          draft.id === id
            ? {
                ...draft,
                reviewStatus,
                editorNotes: editorNotes ?? draft.editorNotes,
                updatedAt: new Date().toISOString(),
              }
            : draft,
        ),
      };
      emit();
    },
  };
}

export const publicationStore = createPublicationStore();

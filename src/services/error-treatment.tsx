const errorMessages: {
  createConflict: Record<PageType, string>;
  deleteConflict: Partial<Record<PageType, string>>; // "playlist" doesn't have a delete conflict
  generic: string;
} = {
  createConflict: {
    artist: "This artist has already been registered.",
    album: "This album has already been registered.",
    song: "This song has already been registered.",
    playlist: "This playlist has already been registered.",
  },
  deleteConflict: {
    artist:
      "This artist cannot be deleted because it is referenced by an album.",
    album: "This album cannot be deleted because it is referenced by a song.",
    song: "This song cannot be deleted because it is referenced by a playlist.",
  },
  generic: "This action could not be concluded, please try again later.",
};

interface ErrorResponse {
  status: number;
  message: string;
}

type PageType = "artist" | "album" | "song" | "playlist";

const deleteAssetReferenceConflict =
  "failed to delete asset: another asset holds a reference to this one";
const createAssetReferenceConflict =
  "failed to write asset to ledger: asset already exists";

export const errorTreatment = (
  error: ErrorResponse,
  page: PageType
): string => {
  const createConflictMessage = errorMessages.createConflict[page];
  const deleteConflictMessage = errorMessages.deleteConflict[page];

  if (error.status === 409 && error.message === createAssetReferenceConflict) {
    return createConflictMessage || errorMessages.generic;
  }

  if (error.status === 400 && error.message === deleteAssetReferenceConflict) {
    return deleteConflictMessage || errorMessages.generic;
  }

  return errorMessages.generic;
};

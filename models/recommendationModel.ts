export interface AuthorModel {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'professor' | 'admin';
}

export type ReactionType = 'wise' | 'loved' | 'support' | 'applause' | 'like' | 'opps'

export interface ReactionModel {
  _id: string;
  userId: string;
  type: ReactionType;
}

export interface CommentModel {
  _id: string;
  content: string;
  authorId: AuthorModel;
  parentCommentId: string | null;
  acceptedBy: {
    author: boolean;
    professor: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedSolutionModel {
  _id: string;
  solutionContent: string;
  solutionAuthor: AuthorModel;
  acceptedBy: {
    author: boolean;
    professor: boolean;
  };
  similarQuestion: {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    questionAuthor: AuthorModel;
  };
  matchedTags: string[];
  createdAt: string;
}

export interface QuestionModel {
  _id: string;
  title: string;
  content: string;
  authorId: AuthorModel;
  authorRole: string;
  imageUrl?: string;
  linkUrl?: string;
  tags: string[];
  isSolved: boolean;
  solutionCommentId: string | null;
  counters: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionResponse {
  success: boolean;
  message: string;
  data: QuestionModel;
}

export interface GetQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    data: QuestionModel[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetQuestionDetailResponse {
  success: boolean;
  message: string;
  data: {
    question: QuestionModel;
    comments: CommentModel[];
  };
}

export interface SuggestedSolutionsResponse {
  success: boolean;
  message: string;
  data: SuggestedSolutionModel[];
}

export interface SimpleResponse {
  success: boolean;
  message: string;
}

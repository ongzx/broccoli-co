export interface InitialState {
  name: string;
  email: string;
  confirmEmail: string;
}

export interface InitialFormStatus {
  isLoading: boolean;
  status?: string;
  errorMessage?: string;
}

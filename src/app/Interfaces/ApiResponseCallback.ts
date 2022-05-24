export interface ApiResponseCallback {
    onSuccess(response);
    onError(errorCode: number, errorMsg: string);
}

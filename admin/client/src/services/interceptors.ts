type InterceptorManager<T> = {
  use: (onFulfilled: (value: T) => T | Promise<T>) => unknown
}

type ApiClientWithInterceptors = {
  interceptors: {
    request: InterceptorManager<unknown>
    response: InterceptorManager<unknown>
  }
}

export const attachInterceptors = (client: ApiClientWithInterceptors) => {
  client.interceptors.request.use((config) => config)
  client.interceptors.response.use((response) => response)
}

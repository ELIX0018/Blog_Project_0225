import {qsPost, post, get, put, del} from './axios'

// 认证相关接口
export const loginApi = (data: any) => post('/api/auth/login', data);
export const registerApi = (data: any) => post('/api/auth/register', data);
export const getUserInfoApi = () => get('/api/auth/me');
export const updateUserProfileApi = (data: any) => put('/api/auth/profile', data);

// 文章相关接口
export const getArticlesApi = (params: any) => get('/api/articles', { params });
export const getArticleByIdApi = (id: string) => get(`/api/articles/${id}`);
export const createArticleApi = (data: any) => post('/api/articles', data);
export const updateArticleApi = (id: string, data: any) => put(`/api/articles/${id}`, data);
export const deleteArticleApi = (id: string) => del(`/api/articles/${id}`);
export const likeArticleApi = (id: string) => post(`/api/articles/${id}/like`);

// 日记相关接口
export const getDiariesApi = (params: any) => get('/api/diaries', params);
export const getDiaryByIdApi = (id: string) => get(`/api/diaries/${id}`);
export const createDiaryApi = (data: any) => post('/api/diaries', data);
export const updateDiaryApi = (id: string, data: any) => put(`/api/diaries/${id}`, data);
export const deleteDiaryApi = (id: string) => del(`/api/diaries/${id}`);
export const getUserDiariesApi = (userId: string, params: any) => get(`/api/diaries/user/${userId}`, { params });

// 留言板相关接口
export const getGuestbookApi = (params: any) => get('/api/guestbook', { params });
export const createGuestbookApi = (data: any) => post('/api/guestbook', data);
export const deleteGuestbookApi = (id: string) => del(`/api/guestbook/${id}`);
export const likeGuestbookApi = (id: string) => post(`/api/guestbook/${id}/like`);

// 文章评论相关接口
export const getArticleCommentsApi = (articleId: string, params: any) => get(`/api/guestbook/article/${articleId}`, { params });
export const createArticleCommentApi = (articleId: string, data: any) => post(`/api/guestbook/article/${articleId}`, data);

// 文件上传接口
export const uploadSingleFileApi = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/api/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadMultipleFilesApi = (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return post('/api/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadArticleImageApi = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return post('/api/upload/article', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadAvatarApi = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return post('/api/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 健康检查
export const healthCheckApi = () => get('/api/health');

// 友链相关接口
export const getLinksApi = () => get('/api/links');
export const createLinkApi = (data: any) => post('/api/links', data);
export const getPendingLinksApi = () => get('/api/links/pending');
export const approveLinkApi = (id: string) => put(`/api/links/${id}/approve`, {});
export const rejectLinkApi = (id: string) => del(`/api/links/${id}/reject`);


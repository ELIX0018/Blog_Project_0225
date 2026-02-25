// 这里是一些类型的封装


export interface ArticleType {
id:string,
  title:string,
  date:string,
  labels:Array<string>
  }

export interface articleInfoType {
  articleContent:string,
  articleDate:string,
  userName:string,
  userId:string,
  }
export interface diaryType {
  diaryContent:string,
  diaryDate:string,
  id:string,
  qq:string,
  qqName:string,
  userId:string,
  userName:string,
  user_head:string,
}

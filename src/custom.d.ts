type Tag = {
  id: string;
  name: string;
  iconName: string;
  mold: string;
}
type RecordItem = {
  tagIds: string[];
  notes: string;
  createAt: string;
  category: '-' | '+';
  amount: number;
}
type RootState = {
  recordList: RecordItem[];
  tagList: Tag[];
  category: string;
}
type Payload = {
  id?: string;
  name: string;
  iconName: string;
  mold: string;
  category: string;
}
type Category = {
  category: string;
}
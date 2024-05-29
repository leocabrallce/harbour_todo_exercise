import { MyLists } from '@/components/MyLists';

export default function Home() {
  return (
    <div className="p-8 flex items-center flex-col">
      <div className="w-full max-w-[500px]">
        <MyLists />
      </div>
    </div>
  );
}

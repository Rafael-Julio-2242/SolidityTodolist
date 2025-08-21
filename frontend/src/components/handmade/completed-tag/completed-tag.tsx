'use client';


export default function CompletedTag({ completed }: { completed: boolean }) {

 return (
  <p className={`text-md border-2 rounded-full px-2 py-1 ${completed ? "bg-green-400/60 border-green-600/60" : "bg-red-400/60 border-red-600/60"}`}>
   {completed ? "Completed" : "Not Completed"}
  </p>
 )

}

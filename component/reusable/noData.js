"use client";

import { Inbox } from "lucide-react";

export default function NoData({ message = "Data tidak ditemukan" }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Inbox className="w-20 h-20 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}

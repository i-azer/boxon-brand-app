import type { Route } from "./+types/home";
import { Assessment } from "~/Assessment/assessment";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Software Developer Assessment Task" },
    { name: "form submittion", content: "dynamic form" },
  ];
}

export default function Task() {
  return <Assessment />;
}

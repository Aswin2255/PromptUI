import { Separator } from "../ui/separator";

export default function Footer(){
  return (
    <footer className="w-full">
      <Separator />
      <div className="flex items-center justify-center py-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-foreground">LLMChat</span>
        </p>
      </div>
    </footer>
  )
}
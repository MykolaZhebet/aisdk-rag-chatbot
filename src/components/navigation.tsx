import {
    SignInButton,
    SignUpButton,
    SignOutButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
export const Navigation = () => {
    return (
        <nav className="border-b border-[var(--foreground))]/10">
            <div className="flex container h-16 items-cneter justify-between px-4 mx-auto">
                <div className="text-xl font-semibold">RAG chatbot</div>
                
                <div className="flex gap-2">
                    {/** Renders childrens when user is not signed in */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost">Sign In</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                    {/**Renders childrens when user is signed in */}
                    <SignedIn>
                        <SignOutButton>
                            <Button variant="outline">Sign Out</Button>
                        </SignOutButton>
                    </SignedIn>
                    </div>
                </div>
        </nav>
    );

}
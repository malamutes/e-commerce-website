import { createContext } from "react";

export interface GLobalLoginPromptContextType {
    showLoginPrompt: boolean,
    setShowLoginPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    loginComponent: React.ReactNode,
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}


const GlobalLoginPromptContext = createContext<GLobalLoginPromptContextType>({
    showLoginPrompt: false,
    setShowLoginPrompt: () => { },
    loginComponent: null,
    message: "",
    setMessage: () => { }
});

export interface GLobalLoginTypeContextType {
    logIn: boolean,
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}


const GlobalLoginTypeContext = createContext<GLobalLoginTypeContextType>({
    logIn: true,
    setLogIn: () => { }
})

export { GlobalLoginPromptContext, GlobalLoginTypeContext }

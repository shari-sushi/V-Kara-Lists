export type ContextType = {
    req: { headers: { cookie?: string; }; };
    res: {
        writeHead: (statusCode: number, headers: Record<string, string>) => void;
        end: () => void;
    };
};

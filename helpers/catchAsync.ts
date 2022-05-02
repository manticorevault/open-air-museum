module.exports = (funct: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
    return (req: any, res: any, next: any) => {
        funct(req, res, next).catch(next);
    }
}
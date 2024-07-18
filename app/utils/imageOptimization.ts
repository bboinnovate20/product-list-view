export function isFileLessThan1MB(file: FileList): boolean {
    const MAX_BYTE = 400000;
    if(file[0] != null) {
        if(file[0].size > MAX_BYTE) return false
        return true;
    }
    return false;
}
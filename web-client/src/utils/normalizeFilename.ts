export function normalizeFilename(filename: string): string {

    filename = filename.toLowerCase();


    filename = filename.replace(/ /g, "-");


    filename = filename.replace(/[^a-zA-Z0-9-]/g, "");


    if (filename.length > 20) {
        filename = filename.substring(0, 20);
    }
    

    return filename;
}
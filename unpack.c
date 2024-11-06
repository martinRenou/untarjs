#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>

typedef struct {
    char* filename;
    uint8_t* data;
    size_t data_size;
} FileData;

EMSCRIPTEN_KEEPALIVE
FileData* extract_archive(uint8_t* inputData, size_t inputSize, size_t* outputSize, size_t* fileCount) {
    struct archive* archive;
    struct archive_entry* entry;
    FileData* files = NULL;
    size_t files_count = 0;

    archive = archive_read_new();
    archive_read_support_filter_all(archive);
    archive_read_support_format_all(archive);

    if (archive_read_open_memory(archive, inputData, inputSize) != ARCHIVE_OK) {
        fprintf(stderr, "Error opening archive: %s\n", archive_error_string(archive));
        archive_read_free(archive);
        return NULL;
    }
    printf("Archive opened successfully.\n");

    while (archive_read_next_header(archive, &entry) == ARCHIVE_OK) {
        const char* filename = archive_entry_pathname(entry);
        size_t entrySize = archive_entry_size(entry);
        printf("Extracting file: %s, size: %zu\n", filename, entrySize);

        files = realloc(files, sizeof(FileData) * (files_count + 1));
        if (!files) {
            fprintf(stderr, "Memory allocation error for FileData array.\n");
            archive_read_free(archive);
            return NULL;
        }

        files[files_count].filename = strdup(filename);
        files[files_count].data = malloc(entrySize);
        printf("Setting data_size for file: %s, size: %zu\n", filename, entrySize);
        files[files_count].data_size = entrySize;

        if (!files[files_count].data) {
            fprintf(stderr, "Memory allocation error for file data.\n");
            free(files[files_count].filename);
            archive_read_free(archive);
            return NULL;
        }

        size_t bytesRead = 0;
        while (bytesRead < entrySize) {
            ssize_t ret = archive_read_data(archive, files[files_count].data + bytesRead, entrySize - bytesRead);
            if (ret < 0) {
                fprintf(stderr, "Error reading data for %s: %s\n", filename, archive_error_string(archive));
                for (size_t i = 0; i <= files_count; i++) {
                    free(files[i].filename);
                    free(files[i].data);
                }
                free(files);
                archive_read_free(archive);
                return NULL;
            }
            bytesRead += ret;
            printf("Read %zd bytes for file: %s\n", ret, filename);
        }
        files_count++;
    }

    archive_read_free(archive);
    *outputSize = files_count;
    *fileCount = files_count;

    return files;
}




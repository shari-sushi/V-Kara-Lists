import Image from "next/image";
import React, { useRef, useState } from "react";
import { TestLink } from "../multi";

// 参考：https://zenn.dev/yuyan/articles/f35da08770a135

const SUPPORTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
];
const MAX_ATTACHMENT_BYTE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ATTACHMENT_COUNT = 4;

export interface PrePostImage {
  previewID: string;
  url: string;
  isLoading: boolean;
}

export const ImageComponent = () => {
  const [imagePreviews, setImagePreviews] = useState<PrePostImage[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileLoad = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    if (imagePreviews.length + files.length > MAX_ATTACHMENT_COUNT) {
      return;
    }
    const items = Array.from(files);

    let totalFilesSize = 0;
    items.forEach((file) => {
      totalFilesSize += file.size;
      if (totalFilesSize > MAX_ATTACHMENT_BYTE_SIZE) {
        return;
      }

      const previewID = Math.random().toString(36).slice(-8);
      setImagePreviews((images) => [
        ...images,
        { previewID, url: "", isLoading: true },
      ]);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          return;
        }

        setImagePreviews((prevImages) =>
          prevImages.map((image) =>
            image.previewID === previewID
              ? { ...image, url: result, isLoading: false }
              : image
          )
        );
      };

      reader.onerror = () => {};

      reader.readAsDataURL(file as Blob);
    });

    // NOTE: 同じファイルを重複選択できるようにしてる
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files == null) return;
    handleFileLoad(Array.from(files));
  };

  const handlePasteFile = (
    pasteEvent: React.ClipboardEvent<HTMLDivElement>
  ) => {
    handleFileLoad(
      Array.from(pasteEvent.clipboardData.items).reduce((files, item) => {
        if (item.kind !== "file") return files;
        const file = item.getAsFile();

        if (file == null) return files;

        if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
          return files;
        }

        files.push(file);

        return files;
      }, [] as File[])
    );
  };

  const deleteImage = (uid: string) => {
    setImagePreviews((images) =>
      images.filter((image) => image.previewID !== uid)
    );
  };

  const submit = () => {
    if (imagePreviews.some((image) => image.isLoading)) {
      return;
    }

    // createPost({ text, images: imagePreviews });
  };
  console.log(SUPPORTED_MIME_TYPES.join(","));
  return (
    <div className="p-2 rounded space-y-2 ">
      <div className="pb-4">
        <TestLink thisPageNum={5} />
      </div>
      <div className="pt-4 px-1 w-[600px]">
        <input
          hidden
          id="file"
          type="file"
          accept={SUPPORTED_MIME_TYPES.join(",")}
          onChange={handleInputFile}
          onPaste={handlePasteFile}
          ref={inputFileRef}
          multiple // 画像を複数選択できるようにする
        />

        <div
          className="bg-gray-900 p-2"
          // onDrop={handleDrop}
          // onDragOver={handleDragOver}
          // onDragLeave={handleDragLeave}
        >
          <div className="flex h-10 justify-between items-center bg-gray-700 rounded-md overflow-hidden">
            <input
              className="w-[800px] h-full bg-transparent"
              id="file"
              onPaste={handlePasteFile}
            />
            <label
              htmlFor="file"
              className="flex w-10 justify-center items-center cursor-pointer hover:underline bg-transparent rounded-md "
            >
              <svg
                className={`${
                  imagePreviews.length < 4 ? "fill-gray-200" : "fill-gray-600"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
              </svg>
            </label>
          </div>

          <div className="flex space-x-4 overflow-x-auto py-4 h-40">
            {imagePreviews.length !== 0 &&
              imagePreviews.map((image) => (
                <div key={`${image.previewID}`} className="">
                  <div className="relative">
                    <img
                      height={100}
                      width={100}
                      src={image.url}
                      className="w-32 h-32 border-2 border-gray-600"
                    />
                    <div
                      className="absolute right-1 top-1 border-2 border-gray-600 bg-white text-slate-800 rounded-full h-4 w-4 flex justify-start items-center cursor-pointer"
                      onClick={() => deleteImage(image.previewID)}
                    >
                      ×
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageComponent;

interface PrePostFilesProps {
  className?: string;
  hiddenButton?: boolean;
  images: PrePostImage[];
  setImages: React.Dispatch<React.SetStateAction<PrePostImage[]>>;
}

export interface PrePostImage {
  previewID: string;
  url: string;
  isLoading: boolean;
}

export const PrePostFiles = ({
  className,
  hiddenButton,
  images,
  setImages,
}: PrePostFilesProps) => {
  if (images.length === 0) {
    return null;
  }

  const deleteImage = (uid: string) => {
    setImages((images) => images.filter((image) => image.previewID !== uid));
  };

  return (
    <div className={`relative rounded-md w-full select-none ${className}`}>
      <div className="flex h-fit gap-x-1 rounded-md">
        {images.map((image) => (
          <div
            key={`post_image_${image.previewID}`}
            className={`flex flex-1 justify-center  ${
              images.length === 1 ? "w-32 max-h-[455px]" : "h-32"
            }`}
          >
            {image.isLoading ? (
              <div className="relative h-20 w-20 flex justify-center items-center">
                <div className="flex absolute items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    className="fill-white opacity-80"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                  </svg>
                  <div className="absolute animate-spin-slow h-8 w-8 border-2 rounded-full border-gray-300 border-t-transparent" />
                </div>
                {hiddenButton !== true && (
                  <div className="absolute flex top-0 right-0 bg-on-secondary-container rounded-md shadow-md">
                    <DeleteButton
                      onClick={() => deleteImage(image.previewID)}
                      roundedClass="rounded-md"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`relative  ${
                  images.length === 1 ? "w-fit" : "h-32 w-full"
                }`}
              >
                <img
                  src={image.url}
                  className={`w-full h-full rounded-md ${
                    images.length === 1 ? "object-contain" : "object-cover"
                  }`}
                />
                {hiddenButton !== true && (
                  <div className="absolute flex top-0.5 right-0.5 bg-on-secondary-container rounded-md shadow-md">
                    <DeleteButton
                      onClick={() => deleteImage(image.previewID)}
                      roundedClass="rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface DeleteButtonProps {
  onClick: () => void;
  height?: number;
  width?: number;
  roundedClass?: string;
}

export const DeleteButton = ({
  onClick,
  height = 24,
  width = 24,
  roundedClass,
}: DeleteButtonProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <div
      className={`${roundedClass}  h-fit w-fit justify-start items-center cursor-pointer bg-on-secondary-container hover:bg-on-surface`}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        height={height}
        width={width}
        className="fill-darkred"
      >
        <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
      </svg>
    </div>
  );
};

// plus photo
{
  /* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg> */
}

# IPFS Resizer Service

Welcome to the IPFS Resizer Service, a powerful tool designed to resize multimedia files stored on the InterPlanetary File System (IPFS). Our service provides an easy-to-use interface for adjusting the size of your images and video files, ensuring they meet your specific needs without compromising on quality.

## Features

- **Image Resizing**: Change the dimensions and other properties of your images to optimize for different platforms.
- **Video Rescaling**: Adjust video resolution, aspect ratio, etc for seamless playback across all devices.

## How to Use

1. **Query**: Send the IPFS CID to the service and specify your desired dimensions and other properties.
2. **Resize**: The service fetch the file and resize it according to the provided options.
3. **Result**: Get the resized file back and enjoy your optimized content.

## Demo

https://ipfs-resizer.ledgerwise.io/api

This link opens a swagger documentation where the service can tested.

- Sample Image: https://ipfs-resizer.ledgerwise.io/ipfs/QmUM8YVj2YCrC9mG4TaKapSM8Z5T3MqhQ9eJqDKdgzX5nM?width=200&height=200

- Sample Video: https://ipfs-resizer.ledgerwise.io/ipfs/QmSXorBcDdxwE3kVznUPCUy6xbReQ9qzJEugPfiY614SGR%2FFront%2FGrail%2FDC_GRAIL_BATMAN-REBIRTH_ANIMATION_1.mp4?width=200&height=200

## Getting Started

To start using the IPFS Resizer Service, clone this repository and follow the next steps.

```bash
git clone https://github.com/your-username/ipfs-resizer-service.git
cd ipfs-resizer-service
```

Build and start the service.

```
npm install
npm run build
npm run start
```

Or use docker

```bash
docker build -t nest-ipfs-resizer .
docker-compose up
```

## Example

Execute this command to check if the service is working. Use the link in a browser to view the resized output.

```bash
curl http://localhost:3000/ipfs/QmUkRt94GkTDUa2tTgTCDAm7xne2xYTpzSQizw5mJPf61y/base/4a.jpg?size=200x200
```

## Resizing Options

These options can be provided as query params to `/ipfs/*` endpoint.

- **format**: Force output to a given format. By default the resizer will use webp for image and webm for video. Eg: mp4, avi, etc
- **size**: The resolution of the resized file. Ignored if provider does not provide allowed size options. (Only works for video and image.) Eg: 200x200, 720x576
- **width**: The desired width of the resized file. Ignored if provider provides size options. (Only works for video and image.)
- **height**: The desired height of the resized file. Ignored if provider provides size options. (Only works for video and image.)
- **fit**: How the image should be resized to fit both provided dimensions. By default contain will be used as the fit. (Only works for image.) Eg: contain, cover, etc
- **animated**: If set to false, the output image will be non-animated. Default value is false. (Only works for image.)
- **without_enlargement**: Do not enlarge if the width or height are already less than the specified dimensions. (Only works for image.)
- **background**: Background color of the media. Eg: white (Only works for video and image.)

See the swagger docs `/api` to play with the service.

## Configuration Options

When using the service a lot of options can be configured as per the requirements in the `.env` file.

- **IPFS_GATEWAY**: The IPFS gateway used to fetch the original resource (required).
- **PRUNE_CRON_EXPRESSION**: This option is used to specify when should the pruning service run to delete old files. By default, runs the service weekly.
- **PRUNE_AGE (In seconds)**: If a file is not being fetched for this interval then it's removed. By default, removes any file older than a month.
- **DEFAULT_IMG_FORMAT**: The default format used to resize image. Default: `webp`
- **DEFAULT_VIDEO_FORMAT**: The default format used to resize video. Default: `webm`
- **DEFAULT_IMG_ANIM**: Defines a default boolean specifying if the output image will be animated or not. If not provided `false` is used.
- **DEFAULT_IMG_FIT**: Default fit used when resizing the image. If not provided `contain` is used.
- **SIZE_OPTIONS**: Optional value to limit what resolutions can be accepted for resizing in `width`x`height` format. eg: `200x200,370x370`.
- **BACKGROUND_OPTIONS**: Optional value to limit what background colors can be accepted for image and videos. eg: `black,white`.
- **MAX_CONTENT_LENGTH**: Optional value describing max size of the file to fetch in bytes. If the original resource while resizing is greater than this, then the service stops the process.
- **LOG_ERRORS**: Optional value describing if the errors should be logged. Useful for debugging.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For support, email hello@ledgerwise.io or open an issue in the GitHub repository.

Enjoy optimizing your multimedia files with IPFS Resizer Service!
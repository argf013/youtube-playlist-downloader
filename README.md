# YouTube Playlist Downloader

A Node.js application to download and merge videos and audio from a YouTube playlist using `ytpl`, `ytdl-core`, and `ffmpeg`.

## Features
- Downloads all videos from a specified YouTube playlist
- Saves videos in 1080p resolution
- Separately downloads audio and merges it with video using `ffmpeg`
- Automatically removes temporary files after merging

## Requirements
- Node.js
- `ytpl`
- `ytdl-core`
- `ffmpeg-static`
- `fluent-ffmpeg`

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/argf013/youtube-playlist-downloader.git
   cd youtube-playlist-downloader

2. Install the dependencies:
   ```bash
   npm install

## Usage
1. Set the YouTube playlist URL and output directory in the script:
    
    ```js
    const youtubePlaylistUrl = "https://youtube.com/playlist?list=YOUR_PLAYLIST_ID";
    const outputDirectory = path.join(__dirname, "playlist_output");
2. Run the script:
    
    ```bash
    node index
    
## Contributing
Feel free to open issues or submit pull requests for improvements and bug fixes.

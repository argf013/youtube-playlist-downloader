const ytpl = require("ytpl");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

async function downloadYouTubePlaylist(playlistUrl, outputDirectory) {
  try {
    const playlistInfo = await ytpl(playlistUrl);

    for (const video of playlistInfo.items) {
      const videoUrl = video.shortUrl;
      const videoTitle = video.title.replace(/[\\/:"*?<>|]/g, "");
      const videoOutputPath = path.join(outputDirectory, `${videoTitle}.mp4`);
      const audioOutputPath = path.join(
        outputDirectory,
        `${videoTitle}_audio.mp4`
      );
      const finalOutputPath = path.join(
        outputDirectory,
        `${videoTitle}_final.mp4`
      );

      await downloadYouTubeVideo(
        videoUrl,
        videoOutputPath,
        audioOutputPath,
        finalOutputPath
      );
    }

    console.log("All videos in the playlist have been successfully downloaded.");
  } catch (error) {
    console.error("An error occurred while downloading the playlist:", error);
  }
}

async function downloadYouTubeVideo(
  url,
  videoOutputPath,
  audioOutputPath,
  finalOutputPath
) {
  try {
    const info = await ytdl.getInfo(url);

    // Select 1080p video format
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: "137" });
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "140" });

    if (!videoFormat || !audioFormat) {
      throw new Error("Video or audio format not found.");
    }

    // Download video
    const videoStream = ytdl(url, { format: videoFormat });
    const audioStream = ytdl(url, { format: audioFormat });

    // Save video to file
    const videoFileStream = fs.createWriteStream(videoOutputPath);
    videoStream.pipe(videoFileStream);

    await new Promise((resolve, reject) => {
      videoFileStream.on("finish", resolve);
      videoFileStream.on("error", reject);
    });

    // Save audio to file
    const audioFileStream = fs.createWriteStream(audioOutputPath);
    audioStream.pipe(audioFileStream);

    await new Promise((resolve, reject) => {
      audioFileStream.on("finish", resolve);
      audioFileStream.on("error", reject);
    });

    // Combine video and audio using ffmpeg
    ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(videoOutputPath)
      .input(audioOutputPath)
      .outputOptions("-c:v copy")
      .outputOptions("-c:a aac")
      .save(finalOutputPath)
      .on("end", () => {
        console.log(`${url} - Video successfully downloaded and merged.`);

        // Delete temporary files after merging
        fs.unlink(videoOutputPath, (err) => {
          if (err) {
            console.error("Failed to delete temporary video file:", err);
          } else {
            console.log("Temporary video file successfully deleted.");
          }
        });
        fs.unlink(audioOutputPath, (err) => {
          if (err) {
            console.error("Failed to delete temporary audio file:", err);
          } else {
            console.log("Temporary audio file successfully deleted.");
          }
        });
      })
      .on("error", (err) => {
        console.error(`${url} - Failed to merge video and audio:`, err);
      });
  } catch (error) {
    console.error(`${url} - An error occurred:`, error);
  }
}

const youtubePlaylistUrl =
  "https://youtube.com/playlist?list=abcd";
const outputDirectory = path.join(__dirname, "playlist_output");

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

downloadYouTubePlaylist(youtubePlaylistUrl, outputDirectory);

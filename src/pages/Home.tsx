import VideoPlayer from "@components/VideoPlayer";
import SampleVideo from "@assets/videos/sample-video.mp4";

const Home = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <VideoPlayer
        videoSrc={SampleVideo}
        className="mx-auto w-full xs:w-11/12 sm:w-10/12 lg:w-9/12 xl:w-8/12"
      />
    </div>
  );
};

export default Home;

const Loading = ( { shortUrl }) => {
  return (
    <div className='absolute flex items-center text-4xl gap-2.5 justify-center h-400 w-600 bg-black/50 backdrop-blur-sm'>
        <span className='text-white'>Your Shortened URL is:- </span>
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>
          {shortUrl}
        </a>
      </div>
    )
  }

export default Loading

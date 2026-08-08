import OglWaves from './component/wavBg';
import axios from 'axios';
import { useState } from 'react';
import Loading from './component/Loading';
const App = () => {


  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert('Please enter a valid URL');
      setUrl('');
      return;
    }


    axios.post('http://localhost:1212/api/shorten/', { longURL: url })
      .then((response) => {
        setShortUrl(response.data.shortUrl);
        setUrl('');
      })
      .catch((error) => {
        console.error('Error shortening URL:', error);
      });



  }


  return (
    <OglWaves>
      {/* Everything inside here acts as foreground UI over the line waves */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        fontFamily: 'sans-serif'
      }}>
        {!shortUrl &&
        <div>
          <h1 style={{ fontSize: '3rem', fontStyle: 'italic', margin: 0 }}>Welcome to Url Shortener WebApp</h1>

          <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center'>
            <input value={url} onChange={(e) => {
              setUrl(e.target.value);
            }} className=' border-white/20 border-[1.2px] py-2 px-4 w-[50%] text-center outline-none mt-5' type="text" placeholder="Paste the Url Here:-" />
            <button type='submit' className='bg-white/20 active:scale-95 border-white/20 border-[1.2px] py-2 px-4 w-fit text-center outline-none mt-5 hover:bg-white/30 transition-all duration-75'>Shorten Url</button>
          </form>
        </div>}
        
        {shortUrl && <Loading shortUrl={shortUrl} />}

        <h2 className='absolute bottom-0 right-0 font-style: italic p-3 text-white/30'>produced by- prakharg02007-tech</h2>
      </div>
    </OglWaves>
  )
}

export default App
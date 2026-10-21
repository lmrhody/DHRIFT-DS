import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isLocalContentMode, LOCAL_CONTENT_OWNER } from '../utils/github'
// import WorkshopsView from '../components/WorkshopsView';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In local content mode, open the Digital Scholar institute from this computer
    router.replace(isLocalContentMode
      ? `/inst?instUser=${LOCAL_CONTENT_OWNER}&instRepo=ds-site`
      : '/inst?instUser=dhri-curriculum&instRepo=dhrift-site-template')
  }, [router])

  return (
    <div className='home'>
      <div className='home-header'>
        <div className='home-header-left'>
          DHRIFT
        </div>
      </div>
    </div>
  )
}

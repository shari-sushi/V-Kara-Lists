import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EditPage({ karaokeData }) {
    const [data, setData] = useState(karaokeData);

    // Rest of your page...

    return (
        <div>
            <h1>Edit Page</h1>
            <p>{data.unique_id}</p>
            <p>{data.movie}</p>
            {/* Rest of your JSX... */}
        </div>
    )
}

export async function getStaticPaths() {
    const res = await fetch('http://localhost:8080/')
    const karaokeData = await res.json()

    const paths = karaokeData.map((item) => ({
        params: { unique_id: item.unique_id.toString() },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const res = await fetch(`http://localhost:8080/show?unique_id=${params.unique_id}`)
    const karaokeData = await res.json()

    return { props: { karaokeData } }
}

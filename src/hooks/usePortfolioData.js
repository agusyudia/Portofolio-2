import { useState, useEffect } from 'react'

export function usePortfolioData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load portfolio data:', err)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

import React, { useContext } from 'react'
import Nav from '../Component/Nav'
import Card from '../Component/Card' 
import { listingDataContext } from '../Context/ListingContext'

function Home() {
  const context = useContext(listingDataContext) || {};
  const { newListData = [] } = context; 

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <Nav />
      
      <div className='w-full max-w-[1400px] mx-auto flex items-start justify-center gap-6 flex-wrap pt-[230px] md:pt-[200px] px-6 pb-20'>        
        {newListData.length > 0 ? (
          newListData.map((list) => (
            <Card 
                key={list._id}
                id={list._id}
                title={list.title}
                city={list.city}
                landMark={list.landmark} 
                rent={list.rent}
                image1={list.image1}
                image2={list.image2}
                image3={list.image3} 
                isBooked={list.isBooked}
                host={list.host}
                // FIX: Pass the guest ID so the Card knows who booked it
                guest={list.guest}
                ratings={list.averageRating || 0} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">🏠</div>
            <h2 className="text-2xl font-bold text-gray-700">No Listings Yet</h2>
            <p className="text-gray-500 max-w-md">
                It looks like our database is empty. Be the first host to publish a luxury flat!
            </p>
          </div>
        )}

      </div>
    </div> 
  )
}

export default Home
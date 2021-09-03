import React, {useState} from 'react'
import './App.css';
import { gql, useQuery } from '@apollo/client'




  // const EXCHANGE_RATES = gql`
  // query GetExchanges{
  //   rates(currency:"USD"){
  //   rate
  //   currency
  //   }
  // }`

  // function ExchangeRates({currency, rate}){
  //   const { loading, error, data } = useQuery(EXCHANGE_RATES,{
  //     variables:{currency, rate}
  //   })
  //   if(loading) return <p>Loading...</p>
  //   if(error) return <p>Error...</p>


  //   console.log('data: ',data)
  //   return(
  //     <select>
  //       {data.rates.map(({currency, rate})=>(
  //         <option key={currency}>
  //           {currency}: {rate}
  //         </option>
  //     ))}
  //   </select>
  //   )

  //   // return data?.rates?.map()
  // }
const GET_DOGS = gql`
query GetDogs {
  dogs {
    id
    breed
  }
}
`

function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  );
}

const GET_DOG_PHOTO = gql`
  query dog($breed: String!){
    dog(breed: $breed){
      id
      displayImage
    }
  }
`

function DogPhoto({ breed }){
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_DOG_PHOTO,
    {
      variables: { breed },
      notifyOnNetworkStatusChange: true
    }
  )

  if (networkStatus === 4 ) return <p>Refetching!</p>
  if (loading) return null
  if (error) return `Error!: ${error}`
  return(
    <div>
        <div>
          <img src={data.dog.displayImage} stype={{height:100, width:100}} />
        </div>
        <button onClick={()=>refetch()}>Refetch!</button>
    </div>
  )
}


function App() {

  const [selectedDog, setSelectedDog] = useState(null)


  function onDogSelected({target:{value}}){
    setSelectedDog(value)
  }

  return (
    <div className='App-header'>
      <h2>hello </h2>
      {selectedDog && <DogPhoto breed = {selectedDog} />}
      <Dogs onDogSelected={onDogSelected}/>
    </div>
  );
}

export default App;

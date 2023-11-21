import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./styles"
import { FaArrowLeft } from 'react-icons/fa'
import api from "../../services/api";


export default function Repos(){

  const { repositorio } = useParams();
  const decodeRepo = decodeURIComponent(repositorio).trim()
  const [repos, setRepos] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: false}
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  //Buscar repos-->
  useEffect(()=>{

    async function load(){
      const nomeRepo = decodeRepo;
    //~~>
    const [repositorioData, issuesData] = await Promise.all([
      api.get(`/repos/${nomeRepo}`),
      api.get(`/repos/${nomeRepo}/issues`,{
        params:{
        state: filters.find(f => f.active).state,
        per_page: 5
      }
    })
    ]);//<~~
      setRepos(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load();

  }, [decodeRepo]);
//<--BR

//-->Page
useEffect(() => {

  async function loadIssues(){
    const decodeRepo = decodeURIComponent(repositorio).trim();

    const response = await api.get(`/repos/${decodeRepo}/issues`,{
      params:{
        state: filters[filterIndex].state,
        page,
        per_page: 5,
      },
    });

    setIssues(response.data);
  }

  loadIssues();

},[filterIndex, filters, decodeRepo, page]);

  function handlePage(action){
    setPage(action === 'back' ? page -1 : page + 1 )
  };//<--Page

  function handleFilter(index){
    setFilterIndex(index)
    console.log(filterIndex)
  };


  if(loading){
    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }
  return(
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#fff" size={30}/>
      </BackButton>
      <Owner>
      <img
        src={repos.owner.avatar_url}
        alt={repos.owner.login}
        />
        <h1>{repos.name}</h1>
        <p>{repos.description}</p>
      </Owner>

      <FilterList active={filterIndex}>
        {filters.map((filter, index) =>(
          <button
          type='button'
          key={filter.label}
          onClick={()=>handleFilter(index)}
          >{filter.label}</button>
        ) )}
      </FilterList>

      <IssuesList>
        {issues.map(issue =>(
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login}/>

            <div>
              <strong>

                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map(label =>(

                  <span key={String(label.id)}>
                    {label.name}
                  </span>
                ))}

                <p>{issue.user.login}</p>
              </strong>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={()=> handlePage('back')}
          disabled={page === 1 ? true : false}
          >
            Voltar
        </button>
        <button
          type="button"
          onClick={()=> handlePage('next')}
          >
            Proxima
        </button>
      </PageActions>
    </Container>
  )
}

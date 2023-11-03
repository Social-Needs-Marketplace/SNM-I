import {Box, Container, Paper} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {DataTable, Link} from "../shared";
import {useClientAPIs} from "../../api/clientApi";
import {ArrowRight} from "@mui/icons-material";
import MatchingDropdownMenu from "./MatchingDropdownMenu";

export default function Matching({}) {
  const navigate = useNavigate();
  const {id} = useParams();

  const [data, setData] = useState([]);
  const {matchFromClient} = useClientAPIs();

  useEffect(() => {
    matchFromClient(id).then(({data}) => {
      setData(data);
    });
  }, [id])

  const columns = useMemo(() => {
    return [
      {
        label: 'Type',
        body: ({type}) => type
      },
      {
        label: 'Name',
        body: ({path, name, type}) => {
          const uri = path[path.length - 1];
          return <Link color to={`/${type}s/${uri.split('_')[1]}`}>{name}</Link>;
        },
        sortBy: ({name}) => name,
      },
      {
        label: 'Distance',
        body: ({distance}) => distance,
      },
      {
        label: 'Path',
        body: ({path}) => {
          const renderedPath = [];
          path = path.slice(1, path.length - 1);
          for (const [idx, uri] of path.entries()) {
            const type = uri.split('#')[1].split('_')[0];
            const id = uri.split('_')[1];
            let link = `/${type}s/${id}`;
            if (type === 'need' || type === 'characteristic' || type === 'needSatisfier') {
              link = `/${type}/${id}/edit`;
            }
            renderedPath.push(<Link color to={link}>{type} {id}</Link>);
            if (idx !== path.length - 1) {
              renderedPath.push(<ArrowRight fontSize={"small"}/>)
            }
          }
          return <Box sx={{display: 'flex'}}>{renderedPath}</Box>;
        }
      },
      {
        label: ' ',
        body: ({type, path}) => {
          const serviceOrProgramId = path[path.length - 1].split('_')[1];

          let needId;
          const path_slice = path.slice(1, path.length - 1);
          for (const [idx, uri] of path_slice.entries()) {
            const type = uri.split('#')[1].split('_')[0];
            if (type === 'need') {
              needId = uri.split('_')[1];
              break;
            }
          }

          return <MatchingDropdownMenu type={type} clientId={id} needId={needId} serviceOrProgramId={serviceOrProgramId}/>
        }
      }
    ]
  }, [id])


  return <Container>
    <DataTable
      columns={columns}
      data={data}
      title="Matched Programs/Services"
      defaultOrderBy={columns[2].body}
    />
  </Container>
}
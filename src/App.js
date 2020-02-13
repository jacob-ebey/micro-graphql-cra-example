import React from "react";
import { createCache, createClient, objectHash } from "@micro-graphql/core";
import { MicroGraphQLProvider, useQuery } from "@micro-graphql/hooks";

const microClient = createClient({
  fetch,
  cache: createCache(),
  hash: objectHash,
  url: "https://swapi-graphql.netlify.com/.netlify/functions/index"
});

const Home = () => {
  const [episodeId, setEpisodeId] = React.useState("ZmlsbXM6MQ==");
  const handleEpisodeChanged = React.useCallback(
    event => {
      event.preventDefault();
      setEpisodeId(`${event.target.value}`);
    },
    [setEpisodeId]
  );

  const { data, errors, loading } = useQuery(
    React.useMemo(
      () => ({
        query: `
			query TestQuery($id: ID) {
				film(id: $id) {
					id
					title
				}
				allFilms {
					films {
						id
						title
					}
				}
			}
		`,
        variables: {
          id: episodeId
        }
      }),
      [episodeId]
    )
  );

  const selector =
    data && data.allFilms && data.allFilms.films ? (
      <select defaultValue={`${episodeId}`} onChange={handleEpisodeChanged}>
        {data.allFilms.films.map(({ title, id }) => (
          <option key={id} value={`${id}`}>
            {title || id}
          </option>
        ))}
      </select>
    ) : null;

  if (loading) {
    return (
      <React.Fragment>
        {selector}
        <h1>Loading........</h1>
      </React.Fragment>
    );
  }

  if (errors) {
    return (
      <React.Fragment>
        {selector}
        <h1>Errors...</h1>
        <pre>
          <code>{JSON.stringify(errors, null, 2)}</code>
        </pre>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {selector}
      <h1>Data!!!</h1>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </React.Fragment>
  );
};

const App = () => (
  <MicroGraphQLProvider client={microClient}>
    <Home />
  </MicroGraphQLProvider>
);

export default App;

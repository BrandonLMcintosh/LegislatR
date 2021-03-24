from keys import openstates
from string import Template

key = f'apikey={openstates}'

root = 'https://v3.openstates.org/'

route_jurisdictions = 'jurisdictions?'
route_people = 'people?'

query_classification = 'classification='
query_jurisdiction = 'jurisdiction='
query_page = 'page='
query_id = 'id='

request_states = Template(
    f'{root}{route_jurisdictions}{query_classification}$classification&{key}')

request_state_politicians = Template(
    f'{root}{route_people}{query_jurisdiction}$state_name&{query_page}$page&{key}')

request_politician = Template(
    f'{root}{route_people}{query_id}$os_id&{key}'
)

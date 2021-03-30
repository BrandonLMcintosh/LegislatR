from keys import openstates
from string import Template

key = f'apikey={openstates}'

root = 'https://v3.openstates.org/'

route_jurisdiction = 'jurisdictions?'
route_people = 'people?'
route_bills = 'bills?'

query_classification = 'classification='
query_jurisdiction = 'jurisdiction='
query_per_page = 'per_page='
query_page = 'page='
query_id = 'id='


request_state = Template(f'{root}{route_jurisdiction}$id&{key}')

request_states = Template(
    f'{root}{route_jurisdiction}{query_classification}state&{key}')

request_state_bills = Template(
    f'{root}{route_jurisdiction}$state_name&{query_per_page}20&{query_page}$page&{key}')

request_state_politicians = Template(f'{root}{route_people}{query_jurisdiction}$id&{key}')

request_politician = Template(f'{root}{route_people}{query_id}$id&{key}')

request_bill = Template(f'{root}{route_bills}%id?include=sponsorships&include=abstracts&include=actions&include=sources&include=documents&include=votes{key}')

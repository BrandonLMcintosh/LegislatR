from keys import openstates

key = f'apikey={openstates}'

root = 'https://v3.openstates.org/'

jurisdictions = 'jurisdictions?'

states = 'classification=state&'

request_states = f'{root}{jurisdictions}{states}{key}'

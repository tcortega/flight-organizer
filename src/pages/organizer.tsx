import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Airline {
  name: string;
  pricePerThousandMiles: number;
}

interface Flight {
  origem: string;
  destino: string;
  data: string;
  companhia: string;
  milhas: number;
  preco: string;
  link: string;
}

interface NewFlight {
  origem: string;
  destino: string;
  data: string;
  companhia: string;
  milhas: string;
  link: string;
}

interface NewAirline {
  name: string;
  pricePerThousandMiles: string;
}

const FlightOrganizer: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>([
    { name: 'LATAM', pricePerThousandMiles: 35 },
    { name: 'GOL', pricePerThousandMiles: 32 },
    { name: 'Azul', pricePerThousandMiles: 38 }
  ]);

  const [flights, setFlights] = useState<Flight[]>([]);

  const [newFlight, setNewFlight] = useState<NewFlight>({
    origem: '',
    destino: '',
    data: '',
    companhia: '',
    milhas: '',
    link: ''
  });

  const [newAirline, setNewAirline] = useState<NewAirline>({
    name: '',
    pricePerThousandMiles: ''
  });

  const handleAddAirline = (): void => {
    if (newAirline.name && newAirline.pricePerThousandMiles) {
      setAirlines([...airlines, {
        name: newAirline.name,
        pricePerThousandMiles: parseFloat(newAirline.pricePerThousandMiles)
      }]);
      setNewAirline({ name: '', pricePerThousandMiles: '' });
    }
  };

  const calculatePrice = (miles: number, airline: string): string => {
    const selectedAirline = airlines.find(a => a.name === airline);
    if (selectedAirline) {
      const priceInReais = (miles / 1000) * selectedAirline.pricePerThousandMiles;
      return priceInReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return '-';
  };

  const handleAddFlight = (): void => {
    if (newFlight.origem && newFlight.destino && newFlight.data &&
      newFlight.companhia && newFlight.milhas && newFlight.link) {
      const miles = parseFloat(newFlight.milhas);
      setFlights([...flights, {
        ...newFlight,
        milhas: miles,
        preco: calculatePrice(miles, newFlight.companhia)
      }]);
      setNewFlight({
        origem: '',
        destino: '',
        data: '',
        companhia: '',
        milhas: '',
        link: ''
      });
    }
  };

  const handleFlightInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { id, value } = e.target;
    setNewFlight(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAirlineInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setNewAirline(prev => ({
      ...prev,
      [id === 'airlineName' ? 'name' : 'pricePerThousandMiles']: value
    }));
  };

  return (
    <div className="space-y-8 p-4">
      {/* Cadastro de Companhias Aéreas */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Companhias Aéreas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="airlineName">Nome da Companhia</Label>
              <Input
                id="airlineName"
                value={newAirline.name}
                onChange={handleAirlineInputChange}
              />
            </div>
            <div>
              <Label htmlFor="pricePerMile">Preço por Mil Milhas (R$)</Label>
              <Input
                id="pricePerMile"
                type="number"
                value={newAirline.pricePerThousandMiles}
                onChange={handleAirlineInputChange}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddAirline}>Adicionar Companhia</Button>
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <thead>
                <tr>
                  <th className="text-left p-2">Companhia</th>
                  <th className="text-left p-2">Preço/Mil Milhas</th>
                </tr>
              </thead>
              <tbody>
                {airlines.map((airline, index) => (
                  <tr key={index}>
                    <td className="p-2">{airline.name}</td>
                    <td className="p-2">R$ {airline.pricePerThousandMiles.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cadastro de Voos */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Voos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="origem">Origem</Label>
              <Input
                id="origem"
                value={newFlight.origem}
                onChange={handleFlightInputChange}
              />
            </div>
            <div>
              <Label htmlFor="destino">Destino</Label>
              <Input
                id="destino"
                value={newFlight.destino}
                onChange={handleFlightInputChange}
              />
            </div>
            <div>
              <Label htmlFor="data">Data e Hora</Label>
              <Input
                id="data"
                type="datetime-local"
                value={newFlight.data}
                onChange={handleFlightInputChange}
              />
            </div>
            <div>
              <Label htmlFor="companhia">Companhia</Label>
              <select
                id="companhia"
                className="w-full p-2 border rounded"
                value={newFlight.companhia}
                onChange={handleFlightInputChange}
              >
                <option value="">Selecione uma companhia</option>
                {airlines.map((airline, index) => (
                  <option key={index} value={airline.name}>{airline.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="milhas">Milhas</Label>
              <Input
                id="milhas"
                type="number"
                value={newFlight.milhas}
                onChange={handleFlightInputChange}
              />
            </div>
            <div>
              <Label htmlFor="link">Link da Passagem</Label>
              <Input
                id="link"
                value={newFlight.link}
                onChange={handleFlightInputChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleAddFlight}>Adicionar Voo</Button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th className="text-left p-2">Origem</th>
                  <th className="text-left p-2">Destino</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Companhia</th>
                  <th className="text-left p-2">Milhas</th>
                  <th className="text-left p-2">Preço</th>
                  <th className="text-left p-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td className="p-2">{flight.origem}</td>
                    <td className="p-2">{flight.destino}</td>
                    <td className="p-2">{new Date(flight.data).toLocaleString('pt-BR')}</td>
                    <td className="p-2">{flight.companhia}</td>
                    <td className="p-2">{flight.milhas.toLocaleString()}</td>
                    <td className="p-2">{flight.preco}</td>
                    <td className="p-2">
                      <a href={flight.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Link da Passagem
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightOrganizer;
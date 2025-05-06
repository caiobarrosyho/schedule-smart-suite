
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  url?: string;
}

const Documents: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    
    setTimeout(() => {
      // Dados de exemplo
      const mockDocuments: Document[] = [
        {
          id: '1',
          title: 'Receita médica',
          type: 'PDF',
          date: '2025-04-20',
          size: '0.5 MB',
          url: '#'
        },
        {
          id: '2',
          title: 'Resultado de exame',
          type: 'PDF',
          date: '2025-04-15',
          size: '1.2 MB',
          url: '#'
        },
        {
          id: '3',
          title: 'Orçamento tratamento',
          type: 'PDF',
          date: '2025-04-01',
          size: '0.3 MB',
          url: '#'
        },
        {
          id: '4',
          title: 'Atestado médico',
          type: 'PDF',
          date: '2025-03-25',
          size: '0.2 MB',
          url: '#'
        }
      ];
      
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Documentos</h1>
          <p className="text-gray-500">Visualize e baixe seus documentos</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-tenant" />
              Documentos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Você não possui documentos disponíveis.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Nome</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Tipo</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Data</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Tamanho</th>
                      <th className="py-2 px-4 text-right font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-tenant" />
                            <span>{doc.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{doc.type}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {new Date(doc.date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-3 px-4">{doc.size}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-700 mb-2">Precisa de ajuda com seus documentos?</h3>
          <p className="text-sm text-blue-600">
            Se você tiver dúvidas sobre seus documentos ou precisar solicitar novos documentos, 
            entre em contato com a recepção ou com seu profissional.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Documents;

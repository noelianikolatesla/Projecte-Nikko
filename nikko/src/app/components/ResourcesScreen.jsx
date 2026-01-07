import { Phone, Copy, ExternalLink, AlertCircle, Heart, Shield, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

export function ResourcesScreen({ onBack }) {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const emergencyContacts = [
    {
      name: "Línea Nacional contra el Bullying",
      phone: "900 20 20 10",
      description: "Atención 24/7 para situaciones de acoso escolar",
      type: "primary",
    },
    {
      name: "Teléfono ANAR",
      phone: "900 20 20 10",
      description: "Ayuda a niños y adolescentes en riesgo",
      type: "primary",
    },
    {
      name: "Emergencias",
      phone: "112",
      description: "Para situaciones de peligro inmediato",
      type: "emergency",
    },
  ];

  const supportResources = [
    {
      title: "¿Qué hacer si sufro bullying?",
      icon: Shield,
      tips: [
        "Habla con un adulto de confianza (padres, profesores, orientador)",
        "No respondas con violencia a la agresión",
        "Guarda evidencias (mensajes, capturas de pantalla)",
        "No estás solo/a, buscar ayuda es valentía, no debilidad",
      ],
    },
    {
      title: "Cómo ayudar a un compañero",
      icon: Heart,
      tips: [
        "No participes ni apoyes el acoso",
        "Acompaña a la víctima y hazle saber que no está sola",
        "Reporta la situación a un adulto responsable",
        "Sé un ejemplo de respeto y empatía",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-gray-900">Recursos de Ayuda</h2>
              <p className="text-sm text-gray-600">Contactos y consejos útiles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Emergency Alert */}
          <Card className="bg-red-50 border-2 border-red-200 p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1">¿Estás en peligro?</h3>
                <p className="text-sm text-red-800 mb-3">
                  Si estás en una situación de riesgo inmediato, contacta a servicios de emergencia o a un adulto de confianza ahora mismo.
                </p>
              </div>
            </div>
          </Card>

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <h3 className="text-gray-900">Líneas de Ayuda</h3>
            {emergencyContacts.map((contact, index) => (
              <Card
                key={index}
                className={`p-4 ${
                  contact.type === "emergency"
                    ? "bg-red-50 border-red-200 border-2"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4
                      className={
                        contact.type === "emergency"
                          ? "text-red-900 mb-1"
                          : "text-gray-900 mb-1"
                      }
                    >
                      {contact.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {contact.description}
                    </p>
                    <p
                      className={`${
                        contact.type === "emergency"
                          ? "text-red-700"
                          : "text-blue-700"
                      }`}
                    >
                      {contact.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => copyToClipboard(contact.phone, contact.name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className={`rounded-full ${
                        contact.type === "emergency"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() => window.open(`tel:${contact.phone}`)}
                    >
                      <Phone className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Support Tips */}
          {supportResources.map((resource, index) => (
            <Card key={index} className="p-5 bg-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                  <resource.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-gray-900">{resource.title}</h3>
              </div>
              <ul className="space-y-2">
                {resource.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex gap-2 text-gray-700">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          {/* Online Resources */}
          <Card className="p-5 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <h3 className="text-gray-900 mb-3">Recursos Online</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between bg-white"
                onClick={() => window.open("https://www.acosoescolar.info", "_blank")}
              >
                <span>Portal contra el Acoso Escolar</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between bg-white"
                onClick={() => window.open("https://www.anar.org", "_blank")}
              >
                <span>Fundación ANAR</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

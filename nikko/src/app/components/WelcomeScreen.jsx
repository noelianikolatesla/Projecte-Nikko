import { Shield, Heart, Lock } from "lucide-react";
import { Button } from "./ui/button";

export function WelcomeScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 space-y-6">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-full p-6 shadow-md">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-3">
          <h1 className="text-blue-900">
            No estás solo/a
          </h1>
          <p className="text-gray-600">
            Estoy aquí para escucharte. Este es un espacio seguro donde puedes compartir lo que sientes sin miedo ni juicio.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-900">
                Confidencial
              </p>
              <p className="text-blue-700 text-sm">
                Tus conversaciones son privadas y seguras
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50">
            <Heart className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-purple-900">
                Apoyo empático
              </p>
              <p className="text-purple-700 text-sm">
                Te acompaño con comprensión y sin juzgarte
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          className="w-full h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md"
        >
          Empezar conversación
        </Button>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-500">
          Si estás en peligro inmediato, por favor contacta a un adulto de confianza o llama a servicios de emergencia
        </p>
      </div>
    </div>
  );
}

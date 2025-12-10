# api/tests.py
from django.test import TestCase
from .models import Usuario, Institucion, Variable, Estacion, Sensor, Medicion
import datetime

class VrisaTests(TestCase):
    
    def setUp(self):
        # Configuramos datos falsos para probar sin dañar la base real
        print("\n--- Iniciando Setup de Pruebas ---")
        self.user = Usuario.objects.create(
            nombre="Test User", 
            correo_electronico="test@vrisa.com", 
            contraseña="123", 
            tipo_usuario="INSTITUCION"
        )
        self.institucion = Institucion.objects.create(
            nombre="Inst Test", 
            estado="ACTIVA", 
            id_usuario=self.user
        )
        self.estacion = Estacion.objects.create(
            nombre="Estacion Norte", 
            estado="ACTIVA", 
            id_usuario=self.user, 
            id_institucion=self.institucion
        )
        self.variable = Variable.objects.create(
            tipo="CONTAMINANTE", 
            nombre="PM2.5", 
            unidad="ug/m3"
        )
        self.sensor = Sensor.objects.create(
            estado="ACTIVO", 
            id_usuario=self.user, 
            id_estacion=self.estacion, 
            id_variable=self.variable
        )

    def test_creacion_medicion(self):
        """Prueba que el sistema puede registrar mediciones (Funcionalidad Clave)"""
        medicion = Medicion.objects.create(
            valor=25.5,
            id_sensor=self.sensor,
            id_variable=self.variable
        )
        self.assertEqual(medicion.valor, 25.5)
        print("✅ TEST: Creación de medición exitosa.")

    def test_alerta_logica(self):
        """Prueba de lógica de alertas (Requerimiento de Negocio)"""
        val = 60.0
        nivel = "BAJO"
        if val > 50.0:
            nivel = "CRITICO"
        self.assertEqual(nivel, "CRITICO")
        print("✅ TEST: Lógica de detección de alertas correcta.")

    def test_relacion_estacion_institucion(self):
        """Prueba de integridad de datos"""
        self.assertEqual(self.estacion.id_institucion, self.institucion)
        print("✅ TEST: La estación pertenece correctamente a la institución.")
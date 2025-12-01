"""
Script para Poblar la Base de Datos con Datos de Prueba
Ejecutar: python populate_test_data.py
"""

import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

def create_user(email, password, nombre, tipo_usuario):
    """Crear un usuario"""
    response = requests.post(f"{BASE_URL}/auth/register/", json={
        "nombre": nombre,
        "primer_apellido": "Apellido",
        "correo_electronico": email,
        "contraseña": password,
        "tipo_usuario": tipo_usuario
    })
    if response.status_code == 201:
        print(f"✅ Usuario creado: {email}")
        return response.json()
    else:
        print(f"❌ Error creando usuario {email}: {response.text}")
        return None

def login(email, password):
    """Iniciar sesión y obtener token"""
    response = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": email,
        "password": password
    })
    if response.status_code == 200:
        token = response.json()['access']
        print(f"✅ Login exitoso: {email}")
        return token
    else:
        print(f"❌ Error en login: {response.text}")
        return None

def create_institucion(token, nombre, direccion):
    """Crear solicitud de institución"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/solicitudes/instituciones/", 
        headers=headers,
        json={
            "nombre": nombre,
            "direccion": direccion,
            "logo": f"https://via.placeholder.com/150?text={nombre[:3]}",
            "estado": "PENDIENTE",
            "id_usuario": 1  # Ajustar según el ID del usuario
        }
    )
    if response.status_code == 201:
        print(f"✅ Solicitud de institución creada: {nombre}")
        return response.json()
    else:
        print(f"❌ Error: {response.text}")
        return None

def create_medicion(token, id_sensor, id_variable, valor):
    """Crear una medición"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/mediciones/",
        headers=headers,
        json={
            "id_sensor": id_sensor,
            "id_variable": id_variable,
            "valor": valor
        }
    )
    if response.status_code == 201:
        print(f"✅ Medición creada: Variable {id_variable}, Valor {valor}")
        return response.json()
    else:
        print(f"❌ Error: {response.text}")
        return None

def create_alerta(nivel, valor, id_estacion, id_variable, mensaje):
    """Crear una alerta"""
    response = requests.post(f"{BASE_URL}/alertas/", json={
        "id_estacion": id_estacion,
        "id_variable": id_variable,
        "nivel": nivel,
        "valor": valor,
        "mensaje": mensaje
    })
    if response.status_code == 201:
        print(f"✅ Alerta creada: {nivel}")
        return response.json()
    else:
        print(f"❌ Error: {response.text}")
        return None

def main():
    print("=" * 60)
    print("VRISA - Script de Datos de Prueba")
    print("=" * 60)
    
    # 1. Crear usuarios de prueba
    print("\n📝 Creando usuarios...")
    create_user("admin@vrisa.com", "admin123", "Administrador", "ADMINISTRADOR")
    create_user("institucion@vrisa.com", "inst123", "Instituto Ambiental", "INSTITUCION")
    create_user("operador@vrisa.com", "oper123", "Operador", "OPERADOR")
    create_user("investigador@vrisa.com", "inv123", "Investigador", "INVESTIGADOR")
    create_user("ciudadano@vrisa.com", "ciud123", "Ciudadano", "CIUDADANO")
    
    # 2. Login como administrador
    print("\n🔐 Iniciando sesión...")
    admin_token = login("admin@vrisa.com", "admin123")
    
    if not admin_token:
        print("❌ No se pudo obtener token. Verifica que el backend esté corriendo.")
        return
    
    # 3. Crear alertas de ejemplo
    print("\n⚠️ Creando alertas de ejemplo...")
    alertas_ejemplo = [
        ("BUENA", 25.5, 1, 1, "Calidad del aire óptima"),
        ("MODERADA", 65.3, 1, 2, "Niveles aceptables de PM10"),
        ("DAÑINA", 125.7, 1, 1, "Precaución para grupos sensibles"),
        ("PELIGROSA", 185.2, 1, 5, "Niveles peligrosos de Ozono"),
        ("MODERADA", 55.0, 1, 3, "Dióxido de azufre en niveles moderados"),
    ]
    
    for nivel, valor, estacion, variable, mensaje in alertas_ejemplo:
        create_alerta(nivel, valor, estacion, variable, mensaje)
    
    print("\n" + "=" * 60)
    print("✅ Datos de prueba creados exitosamente!")
    print("=" * 60)
    print("\n📋 Usuarios creados:")
    print("   - admin@vrisa.com / admin123 (ADMINISTRADOR)")
    print("   - institucion@vrisa.com / inst123 (INSTITUCION)")
    print("   - operador@vrisa.com / oper123 (OPERADOR)")
    print("   - investigador@vrisa.com / inv123 (INVESTIGADOR)")
    print("   - ciudadano@vrisa.com / ciud123 (CIUDADANO)")
    print("\n🌐 Accede a: http://localhost:3000")
    print("=" * 60)

if __name__ == "__main__":
    main()

package expo.modules.phonenumberhint

import android.app.Activity
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val PHONE_NUMBER_HINT_REQUEST_CODE = 4201

class ExpoPhoneNumberHintModule : Module() {

  private var pendingPromise: Promise? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoPhoneNumberHint")

    AsyncFunction("requestPhoneNumberHint") { promise: Promise ->
      if (pendingPromise != null) {
        promise.resolve(mapOf("success" to false, "error" to "Request already in progress"))
        return@AsyncFunction
      }

      val activity = appContext.currentActivity
      if (activity == null) {
        promise.resolve(mapOf("success" to false, "error" to "Activity not available"))
        return@AsyncFunction
      }

      pendingPromise = promise

      try {
        val request = GetPhoneNumberHintIntentRequest.builder().build()

        Identity.getSignInClient(activity)
                .getPhoneNumberHintIntent(request)
                .addOnSuccessListener { pendingIntent ->
                  try {
                    activity.startIntentSenderForResult(
                            pendingIntent.intentSender,
                            PHONE_NUMBER_HINT_REQUEST_CODE,
                            null,
                            0,
                            0,
                            0
                    )
                  } catch (e: Exception) {
                    pendingPromise?.resolve(
                            mapOf(
                                    "success" to false,
                                    "error" to (e.message ?: "Failed to launch hint")
                            )
                    )
                    pendingPromise = null
                  }
                }
                .addOnFailureListener { e ->
                  pendingPromise?.resolve(
                          mapOf(
                                  "success" to false,
                                  "error" to (e.message ?: "Failed to get hint intent")
                          )
                  )
                  pendingPromise = null
                }
      } catch (e: Exception) {
        pendingPromise?.resolve(
                mapOf("success" to false, "error" to (e.message ?: "Unknown error"))
        )
        pendingPromise = null
      }
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode == PHONE_NUMBER_HINT_REQUEST_CODE) {
        val promise = pendingPromise
        pendingPromise = null

        if (payload.resultCode == Activity.RESULT_OK && payload.data != null) {
          try {
            val activity = appContext.currentActivity
            val phoneNumber =
                    if (activity != null) {
                      Identity.getSignInClient(activity).getPhoneNumberFromIntent(payload.data!!)
                    } else null

            if (phoneNumber != null) {
              promise?.resolve(mapOf("success" to true, "phoneNumber" to phoneNumber))
            } else {
              promise?.resolve(
                      mapOf("success" to false, "error" to "Could not extract phone number")
              )
            }
          } catch (e: Exception) {
            promise?.resolve(
                    mapOf(
                            "success" to false,
                            "error" to (e.message ?: "Failed to get phone number")
                    )
            )
          }
        } else {
          promise?.resolve(mapOf("success" to false, "error" to "User cancelled"))
        }
      }
    }
  }
}
